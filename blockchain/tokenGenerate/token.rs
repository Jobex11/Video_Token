use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, InitializeMint};

declare_id!("Fg6PaFpoGXkYsidMpWxqSWqGqj8Wgf89tU2szwNBr55M");

#[program]
pub mod token_creator {
    use super::*;

    pub fn create_token(
        ctx: Context<CreateToken>,
        decimals: u8
    ) -> Result<()> {
        let cpi_accounts = InitializeMint {
            mint: ctx.accounts.mint.to_account_info(),
            rent: ctx.accounts.rent.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        token::initialize_mint(cpi_ctx, decimals, ctx.accounts.payer.key, Some(ctx.accounts.payer.key))?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateToken<'info> {
    #[account(init, payer = payer, mint::decimals = decimals, mint::authority = payer)]
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}
